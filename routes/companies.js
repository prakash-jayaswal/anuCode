const path = require('path');

const express = require('express');
const Company = require('./../models/company')
const router = express.Router()
const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/authenticate');

router.get('/new', ensureAuthenticated, (req,res)=>{
    res.render('companies/new', {company: new Company() })
})


router.get('/edit/:id',ensureAuthenticated, async (req,res)=>{
    const company = await Company.findById(req.params.id)
    res.render('companies/edit', {company: company })
})  

router.get('/:slug',ensureAuthenticated, async (req,res)=>{
const company =  await Company.findOne({slug:req.params.slug} )
if(company == null) res.redirect('/')
res.render('companies/show', {company:company})
})


router.post('/', ensureAuthenticated,async (req,res,next)=>{
req.company = new Company()
next()
},saveCompanyAndRedirect('new'))

router.put('/:id', ensureAuthenticated,async (req,res,next)=>{
    req.company = await Company.findById(req.params.id)
    next()
    },saveCompanyAndRedirect('edit'))


router.delete('/:id', ensureAuthenticated, async(req,res) =>{
    await Company.findByIdAndDelete(req.params.id)
    res.redirect('/companies')
})

function saveCompanyAndRedirect(path){
    return async(req,res)=>{
        let company =req.company
            company.title=req.body.title
            company.description=req.body.description
            company.markdown=req.body.markdown
       
 
         try{
            company= await company.save()
             res.redirect(`/companies/${company.slug}`)
         } catch(e){
             console.log(e)
             res.render(`companies/${path}`,{company:company})
         
         }
    }
}


module.exports = router;