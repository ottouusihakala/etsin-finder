from urllib.parse import urlparse

from flask import make_response, render_template, redirect, request, session
from onelogin.saml2.auth import OneLogin_Saml2_Auth
from onelogin.saml2.utils import OneLogin_Saml2_Utils

from etsin_finder.finder import app

log = app.logger


@app.route('/saml_attributes/')
def saml_attributes():
    paint_logout = False
    attributes = False

    if 'samlUserdata' in session:
        paint_logout = True
        if len(session['samlUserdata']) > 0:
            attributes = session['samlUserdata'].items()

    return render_template('saml_attrs.html', paint_logout=paint_logout,
                           attributes=attributes)


@app.route('/saml_metadata/')
def saml_metadata():
    auth = get_saml_auth(request)
    settings = auth.get_settings()
    metadata = settings.get_sp_metadata()
    errors = settings.validate_metadata(metadata)

    if len(errors) == 0:
        resp = make_response(metadata, 200)
        resp.headers['Content-Type'] = 'text/xml'
    else:
        resp = make_response(', '.join(errors), 500)
    return resp


@app.route('/sso/', methods=['GET'])
def single_sign_on():
    # if 'sso' in request.args:
    #     return redirect(auth.login())
    # elif 'sso2' in request.args:
    #     return_to = '%sattrs/' % request.host_url
    #     return redirect(auth.login(return_to))

    auth = get_saml_auth(request)
    return redirect(auth.login())


@app.route('/slo/', methods=['GET'])
def single_logout():
    auth = get_saml_auth(request)
    name_id = None
    session_index = None
    if 'samlNameId' in session:
        name_id = session['samlNameId']
    if 'samlSessionIndex' in session:
        session_index = session['samlSessionIndex']

    return redirect(auth.logout(name_id=name_id, session_index=session_index))


@app.route('/acs/', methods=['GET', 'POST'])
def attribute_consumer_service():
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    auth.process_response()
    errors = auth.get_errors()
    is_authenticated = auth.is_authenticated()
    if len(errors) == 0:
        session['samlUserdata'] = auth.get_attributes()
        session['samlNameId'] = auth.get_nameid()
        session['samlSessionIndex'] = auth.get_session_index()
        self_url = OneLogin_Saml2_Utils.get_self_url(req)
        log.warning("SESSION: {0}".format(session))
        if 'RelayState' in request.form and self_url != request.form['RelayState']:
            return redirect(auth.redirect_to(request.form['RelayState']))

    render_index_template(errors, is_authenticated=is_authenticated)


@app.route('/sls/', methods=['GET', 'POST'])
def single_logout_service():
    auth = get_saml_auth(request)
    slo_success = False
    dscb = lambda: session.clear()
    url = auth.process_slo(delete_session_cb=dscb)
    errors = auth.get_errors()
    if len(errors) == 0:
        if url is not None:
            return redirect(url)
        else:
            slo_success = True

    render_index_template(errors=errors, slo_success=slo_success)


# This route is used by React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def frontend_app(path):
    return render_index_template()


def render_index_template(saml_errors=[], is_authenticated=False, slo_success=False):
    saml_attributes = False
    if 'samlUserdata' in session:
        if len(session['samlUserdata']) > 0:
            saml_attributes = session['samlUserdata'].items()

    log.info("SAML attributes: {0}".format(saml_attributes))

    return render_template('index.html', title='Front Page', saml_errors=saml_errors, saml_attributes=saml_attributes,
                           is_authenticated=is_authenticated, slo_success=slo_success)


def get_saml_auth(request):
    return OneLogin_Saml2_Auth(prepare_flask_request(request), custom_base_path=app.config['SAML_PATH'])


def init_saml_auth(flask_req):
    return OneLogin_Saml2_Auth(flask_req, custom_base_path=app.config['SAML_PATH'])


def prepare_flask_request(request):
    # If server is behind proxys or balancers use the HTTP_X_FORWARDED fields
    url_data = urlparse(request.url)
    return {
        'https': 'on' if request.scheme == 'https' else 'off',
        'http_host': request.host,
        'server_port': url_data.port,
        'script_name': request.path,
        'get_data': request.args.copy(),
        'post_data': request.form.copy()
        # "lowercase_urlencoding": "",
        # "request_uri": "",
        # "query_string": ""

    }


