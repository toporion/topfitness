const EnrollmentModel = require('../models/EnrollModel');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    try{
        const { enrollmentId } = req.body;
        console.log('see enrollmentId', enrollmentId);
        const enrollment =await EnrollmentModel.findById(enrollmentId).populate('classId');
        if(!enrollment){
            return res.status(404).json({message:"Enrollment not found"});
        }
        const session =await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items:[{
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:enrollment.classId?.name || "class",
                    },
                    unit_amount: enrollment.paymentAmount * 100

                },
                quantity:1,
            }],
            mode:'payment',
            success_url:`${process.env.CLIENT_URL}/payment-success/?enrollmentId=${enrollmentId}`,
            cancel_url:'http://localhost:3000/payment-cancel',
        })
        res.status(200).json({url:session.url})
    }catch(error){
        console.log('stripe error', error);
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

const confirm=async(req,res)=>{
    try{
        const {enrollmentId} = req.body;
        const userId=req.user._id;

        const enroll =await EnrollmentModel.findByIdAndUpdate(
            enrollmentId,
            {paymentStatus:"paid"},
            {new:true}
        )
        .populate("classId")
        .populate("userId","name email")
        
        
    }catch(error){
        console.log('confirm payment error', error);
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

module.exports ={
    createCheckoutSession,
    confirm
}