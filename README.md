## About

## Getting Started

1. **Clone the repo from GitHub**

		git clone https://github.com/illusionalsagacity/frontend-nanodegree-neighborhoodmap
		cd frontend-nanodegree-neighborhoodmap

2. **Using the application** You can view the dist/index.html file in your browser, or use an http server in the dist directory and browse to localhost. For python 3:

		cd dist
		python -m http.server

## Building the Neighborhood Map project
If you prefer to build the project from souce yourself:

1. **Install build dependencies** Make sure you have [Node.js](http://nodejs.org/), [npm](https://www.npmjs.com/), and [Bower](http://bower.io/) installed. These are only used to install dependencies, you don't need them to run the application itself.

		npm install
		bower install

3. **Update vendor files** If you want to get the latest version of jQuery, Knockout.js and Bootstrap, run the following command:

		gulp vendor

4. **Build from source** To build the project:

		gulp deploy

5. **Customizing** To make changes to this project, edit or add files under the src directory. When you are done, rebuild the project.