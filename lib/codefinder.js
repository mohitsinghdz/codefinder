'use babel'
import {CompositeDisposable} from 'atom'
import request from 'request'
export default {
subscriptions: null,
 activate(){
   this.subscriptions = new CompositeDisposable()

   this.subscriptions.add(atom.commands.add('atom-workspace',{
     'codefinder:find': () =>this.find()
   }))
 },
 deactivate()
 {
   this.subscriptions.dispose()
 },
  find()
{
  let editor
 if (editor = atom.workspace.getActiveTextEditor()) {
   let selection = editor.getSelectedText()
   this.download(selection).then((html) => {
     editor.insertText(html)
   }).catch((error) => {atom.notifications.addWarning(error.reason)
   })


   //editor.insertText(reversed)
 }
 },
 download(url)
 {
   return new Promise((res,rej)=>{
     request(url, (error,response,body)=>{
       if(!error && response.statusCode == 200) {
         res(body)
       } else {
         rej({reason:'failed'})
       }
     })
   })



 }
};
