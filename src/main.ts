console.log('Starting...')
require('source-map-support').install()
import {App} from './app'
const app = new App()
app.run()
app.throw()