import Product from "../models/products.js";

export const getProduct=async(req,res)=>{
    const products=await Product.find();
    res.json(products).status(200);
}

export const getProductById=async(req,res)=>{
    const id=req.params.id;
    const product=await Product.findById(id);
    if(!product){
        return res.status(404).json({message:"product not found in this Id"})
    }
    res.json(product).status(200);
}

export const createProduct=async(req,res)=>{
    const product=new Product({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image:req.body.image,
        category:req.body.category,
        rating:req.body.rating,
        user:req.user._id
    })
    
    if(!product){
        return res.status(400).json({message:"fill products details" })
    }

    const newProduct=await product.save();
    res.json(newProduct).status(200);
}

export const updateProduct=async(req,res)=>{
    const id=req.params.id;
    const product=await Product.findByIdAndUpdate(id,req.body,{new:true});
    if(!product){
        return res.status(404).json({message:"Product of this Id is not available"});
    }
    res.json(product).status(200);
}

export const deleteProduct=async(req,res)=>{
    const id=req.params.id;
    const product=await Product.findByIdAndDelete(id);
    if(!product){
        return res.status(404).json({message:"Product of this Id is not available"});
    }
    res.json(product).status(200);
}

