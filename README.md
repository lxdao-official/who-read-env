# Who is reading your environment variables and .env files?

With this npm package, you can detect if a script is reading your environment variables and .env files.

## Usage

    npm install --save-dev who-read-env

And then import into your project:

    import 'who-read-env';

or

    require('who-read-env');

If your project is a Nodejs project, you can import it in any file in your main code.

if your project is a browser project, you can import it into your build script, like webpack.config.js or gulpfile.js or vue.config.js or any other build environment files.

## Example
