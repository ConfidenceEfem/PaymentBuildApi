const express = require("express")
const router = express.Router()
const userModel = require("../models/UserModel")
const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt")
const path = require("path")
const flutterwave = require("flutterwave-node-v3")
// const got = require("got")
const axios = require("axios")
// import got from "got"
require("dotenv").config()
const https = require('https')
const WalletModel = require("../models/WalletModel")
const WalletTransModel = require("../models/WalletTransModel")
const TransactionModel = require("../models/TransactionModel")

const flw = new flutterwave(process.env.Public_Key, process.env.Secret_Key)

router.post("/register", async (req,res)=>{
    try {
        const {firstName, lastName, email, password} = req.body
        if((firstName && lastName && email && password)){
            const findUser = await userModel.findOne({email})
            if(findUser){
                    res.status(404).json({message: "User already exist, please login"})
            }else{
                const saltP = await bcrypt.genSalt(10)
                console.log(saltP)
                const hashP = await bcrypt.hash(password, saltP)

                const createUser = await UserModel.create({
                    firstName, lastName, email, password: hashP
                })

                const token = jwt.sign(
                    {
                        _id: createUser._id,
                        email: createUser.email
                    },
                    "TRanctionAPiKEyGueSStheKeY",
                    {expiresIn: "2h"}
                )

                createUser.token = token

                res.status(201).json({message: "User created", data: createUser})

            }
        }else{
            res.status(404).json({message: "Please input all details"})
        }
    } catch (error) {
        res.status(404).json({message: error.message})
    }
})

router.post("/login", async (req,res)=> {
    try {
        const {email, password} = req.body
        const findUser = await UserModel.findOne({email})
        if(findUser){
            const checkPassword = await bcrypt.compare(password, findUser.password)
            if(checkPassword){
  const token = jwt.sign(
                {
                    _id: findUser._id,
                    email: findUser.email
                },
                "TRanctionAPiKEyGueSStheKeY",
                {expiresIn: "2h"}
            )

            findUser.token = token
            
            res.status(200).json({message: "Login successfully", data: findUser})
            }else{
           res.status(404).json({message: "Incorrect Password"})
            }
          

        }else{

        }
    } catch (error) {
        res.status(404).json({message: error.message})
        
    }
})

const validateUserWallet = async (userid,amount) => {
  try {
    const UserWallet = await WalletModel.findOne({userid})
    if(!UserWallet){
      const wallet = await WalletModel.create({
        userId: userid,
      })
      return wallet
    }else{
   
     return UserWallet
    }
  } catch (error) {
    console.log(error)
  }
}

const CreateWalletTrans = async (userid, amount,currency,status) => {
  try {
    const walletTransaction = await WalletTransModel.create({
      userId:userid, amount,currency,status,isInFlow:true
    })
    return walletTransaction;
  } catch (error) {
    console.log(error) 
  }
}

const createTransaction = async (
  userId,
    transactionId,
    name,
    email,
    phone,
    amount,
    currency,
    paymentStatus,
    paymentGateway,
) => {
try {
  const transaction = await TransactionModel.create({
    userId,
     transactionId,
     name,
     email,
     phone,
     amount,
     currency,
     paymentStatus,
     paymentGateway,
 })
 
 return transaction;
} catch (error) {
  console.log(error)
}
}

const updateWallet = async (userid, amount) => {
  const findWallet = await WalletModel.findOne({userId: userid})
  if(findWallet){
    const update = await WalletModel.findByIdAndUpdate(findWallet._id, {$inc:{balance: amount}}, {new: true})
    return update
  }else{
    console.log("no wallet")
  }
}

// router.post("/createplan", async (req,res)=>{
//     try {
//         const {amount, name, interval, duration} = req.body

//         const payload = {
//             "amount": amount,
//             "name": name,
//             "interval": interval,
//             "duration": duration
//         }

       

//         res.status(201).json({message: "Savings successful", data: response})
//         console.log(response)

//     } catch (error) {
//         res.status(400).json({message: error.message})
//     }
// })

// router.post("/paybill", async (req,res) => {
//     const {email, amount, name, title,phoneNumber} = req.body
//     try {
//         const response = await got.post("https://api.flutterwave.com/v3/payments", {
//             headers: {
//                 Authorization: `Bearer ${process.env.Secret_Key}`
//             },
//             json: {
//                 tx_ref: "hooli-tx-1920bbtytty",
//                 amount: amount,
//                 currency: "NGN",
//                 redirect_url: "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
//                 // meta: {
//                 //     consumer_id: 23,
//                 //     consumer_mac: "92a3-912ba-1192a"
//                 // },
//                 customer: {
//                     email: email,
//                     phonenumber: phoneNumber,
//                     name: name
//                 },
//                 customizations: {
//                     title: title,
//                     logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
//                 }
//             }
//         }).json();
//         console.log(response)
//         res.status(201).json({data: response})
//     } catch (err) {
//         console.log(err.code);
//         res.status(401).json({message: err})
//         // console.log(err.response.body);
//     }
// })

let mySecretKey = process.env.P_Secret_Key

router.post("/paystack-payment", async (ehh,mmm) => {
    try {
        

        const {email, amount} = ehh.body

const params = JSON.stringify({
  "email": email,
  "amount": amount,
  "callback_url": "http://http://localhost:3000/verify",
  
})

const options = {
  hostname: 'api.paystack.co',
  path: '/transaction/initialize',
  method: 'POST',
  headers: {
    Authorization: `Bearer ${mySecretKey}`,
    'Content-Type': 'application/json'
  }
}

const req = https.request(options, res => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  });

  res.on('end', () => {
    console.log(JSON.parse(data))
    let myData = JSON.parse(data)
    
    mmm.status(201).json({message: "success", data: myData})
  })
}).on('error', error => {
  console.error(error)
})

req.write(params)


req.end()

    } catch (error) {
        mmm.status(404).json({message: error.message})
    }
})

router.get("/verify/:ref", async (req,res) => {
 try {
  let ref = req.params.ref
  // console.log(ref)

  const url = `https://api.paystack.co/transaction/verify/${ref}`

  const config = {
    headers: {
      Authorization: `Bearer ${mySecretKey}`
    }
  }

  const verifyPayment = await axios.get(url,config)
  // console.log(verifyPayment?.data?.data)

  const {customer, amount, currency,status,id, gateway_response} = verifyPayment?.data?.data


  const findUser = await userModel.findOne({email: customer.email})
  if(!findUser){
    console.log("user doesn't exist")
  }else{
    let myWallet = await validateUserWallet(findUser._id, amount)
   await CreateWalletTrans(findUser._id,amount,currency,gateway_response)
    let fullName = findUser.firstName + findUser.lastName
    await createTransaction(findUser?._id,id, fullName,findUser?.email, "", amount, currency, gateway_response,"Paystack")
    await updateWallet(findUser?._id, amount)
  console.log(myWallet)
    res.status(200).json({message:"Wallet funded successfully", data: myWallet })
  
  }
 } catch (error) {
  res.status(404).json({message: error.message})
 }
})


module.exports = router