const path = require('path');

const express = require('express');
const Employee = require('./../models/employee')
const router = express.Router()
const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/authenticate');

router.get('/new', ensureAuthenticated, (req,res)=>{
    res.render('employees/newEmployee', {employee: new Employee() })
})


router.get('/edit/:id',ensureAuthenticated, async (req,res)=>{
    const employee = await Employee.findById(req.params.id)
    res.render('employees/editEmployee', {employee: employee })
})  

router.get('/:slug',ensureAuthenticated, async (req,res)=>{
const employee =  await Employee.findOne({slug:req.params.slug} )
if(employee == null) res.redirect('/')
res.render('employees/showEmployee', {employee:employee})
})


router.post('/', ensureAuthenticated,async (req,res,next)=>{
req.employee = new Employee()
next()
},saveEmployeeAndRedirect('newEmployee'))

router.put('/:id', ensureAuthenticated,async (req,res,next)=>{
    req.employee = await Employee.findById(req.params.id)
    next()
    },saveEmployeeAndRedirect('edit'))


router.delete('/:id', ensureAuthenticated, async(req,res) =>{
    await Employee.findByIdAndDelete(req.params.id)
    res.redirect('/employees')
})

function saveEmployeeAndRedirect(path){
    return async(req,res)=>{
        let employee =req.employee
           employee.title=req.body.title
           employee.description=req.body.description
           employee.markdown=req.body.markdown
       
 
         try{
           employee= await employee.save()
             res.redirect(`/employees/${employee.slug}`)
         } catch(e){
             console.log(e)
             res.render(`employees/${path}`,{employee:employee})
         
         }
    }
}


module.exports = router;