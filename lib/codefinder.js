'use babel' //to compile it es5 code
import {CompositeDisposable} from 'atom'
import request from 'request'
import cheerio from 'cheerio'
import google from 'google'
google.resultsPerPage = 1 //to limit number of searches
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

 search(query,lang)
 {
   //editor.insertText(language)

return new Promise((resolve,reject) => {
  let searcher = `${query} in ${lang} site:stackoverflow.com`
  google(searcher,(err,res)=> {
    if(err){
      reject({
        reason: 'cant search'
      })
    }
    else if (res.links.length === 0)
    {
      reject({
        reason: 'nothing'
            })
    }
    else {

      resolve(res.links[0].href)
    }
     })
   })
 },

  find()
{
  let editor
 if (editor = atom.workspace.getActiveTextEditor()) {
   let selection = editor.getSelectedText()
   let language = editor.getGrammar().name
   //editor.insertText(language)


   this.search(selection,language).then((url)=>{
     atom.notifications.addSuccess('googled')
     return this.download(url)
   }).then((html)=> {
     //editor.insertText(language)
     let result = this.findcode(html)
     if(result==''){
       atom.notifications.addWarning('found nothing')
     }
     else {
        atom.notifications.addSuccess('code found')
        editor.insertText(result)
       }
   }).catch((error) => {
     atom.notifications.addWarning(error.reason)
   })
 }
 },




 findcode(html)
 {
   $ = cheerio.load(html)
   return $('div.accepted-answer pre code').text()
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
