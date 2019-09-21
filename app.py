from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
import datetime


app = Flask(__name__)
app.config.update(
    SQLALCHEMY_DATABASE_URI='sqlite:///app.db',
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    DEBUG=True
)
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(128))
    complete = db.Column(db.Boolean(), default=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.now)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


@app.route('/')
def index():
    return render_template('index.html', tasks=Task.query.all())


@app.route('/get-todos')
def get_todos():
    tasks = [t.as_dict() for t in Task.query.all()]
    return jsonify(tasks), 200


@app.route('/add-todo', methods=['POST'])
def add_todo():
    data = request.get_json()
    task = Task(task=data['task'])
    db.session.add(task)
    db.session.commit()
    return jsonify(task.as_dict()), 200


@app.route('/remove-todo/<item_id>', methods=['POST'])
def remove_todo(item_id):
    Task.query.filter_by(id=item_id).delete()
    db.session.commit()
    return '', 200


@app.route('/update-todo/<item_id>', methods=['POST'])
def update_todo(item_id):
    task = Task.query.filter_by(id=item_id).one()
    task.complete = not task.complete
    db.session.commit()
    return '', 200


@app.route('/edit-todo/<item_id>', methods=['POST'])
def edit_todo(item_id):
    data = json.loads(request.data)
    Task.query.filter_by(id=item_id).update({'task': data['task']})
    db.session.commit()
    return '', 200


if __name__ == "__main__":
    app.run(debug=True)
