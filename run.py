'''

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, If not, see <https://www.gnu.org/licenses/>.

'''

import submissions
import simplejson
from flask import Flask, Response, stream_with_context, redirect
app = Flask(__name__, static_url_path='')

@app.route('/')
def hello():
    return redirect('/index.html', code = 301)


@app.route('/api/submissions/actualize', methods = ['POST'])
def actualize():
    session, accepted_submissions = submissions.prepare_submissions()
    response = Response(stream_with_context(submissions.actualize(session, accepted_submissions)))
    response.headers['Content-Length'] = len(accepted_submissions)
    return response


@app.route('/api/submissions/cached')
def cached():
    response = Response(simplejson.dumps(submissions.cached()))
    response.headers['content-type'] = 'application/json'
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1337)
