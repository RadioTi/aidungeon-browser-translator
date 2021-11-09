from deep_translator import GoogleTranslator
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import deepl

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app)

class Translator:
    def __init__(self):
        self.cache = {}

    def translate(self, text, from_lang, to_lang, service='google'):
        # serving from cache
        if (text, from_lang, to_lang) in self.cache:
            return self.cache[(text, from_lang, to_lang)]

        if service == 'deepl':
            time.sleep(1.5)
            result = deepl.translate(
                source_language=from_lang,
                target_language=to_lang,
                text=text)
        elif service == 'google':
            result = GoogleTranslator(
                from_lang,
                to_lang).translate(text)
        else:
            return text

        self.cache[(text, from_lang, to_lang)] = result
        return result


app.config['TRANSLATOR'] = Translator()


@app.route('/translate/')
def home():  # test route
    return '''<h1>Translation Server is Actually Running</h1>''', 200

@app.route('/error')
def error():
    return "error", 500

@app.route('/translate/<text>', methods=['GET'])
def translate(text):
    from_lang = request.args.get('from')
    to_lang = request.args.get('to')
    service = request.args.get('translator') # translation service

    if from_lang is None or to_lang is None or text is None:
        return jsonify({'error': 'Missing parameters'}), 400

    #  text normalization to preserve chat style conversation
    text = text.replace('\n', '(>)')
    text = text.replace(':', '=')

    translator = app.config['TRANSLATOR']
    try:
        result = translator.translate(
            text,
            from_lang,
            to_lang,
            service=service if service else 'google')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # if translation fails, return original text
    if result is None:
        result = text

    result = result.replace("(>)", "\n")
    result = result.replace("=", ":")

    return jsonify({'translation': result}), 200


if __name__ == '__main__':
    app.run()
