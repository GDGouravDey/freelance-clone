import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// import { User } from "../models/user.model.js";
// import { FreelancingOffer } from "../models/freelancingOffer.model.js"; // Import the FreelancingOffer model
// import { Application } from "../models/application.model.js"; // Import the Application model

const connectDB = async () => {
    try {
        console.log(`${process.env.MONGODB_URI}/${DB_NAME}`);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n yesssss hurrah MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);


        // Fetch and log users
        // const entries = await User.find();
        // console.log(entries);

        // Insert a new freelancing offer
        // const result = await FreelancingOffer.create({
        //     title: "Data Mining Engineer",
        //     description: "Looking for a skilled Data Mining Engineer for a long-term project.",
        //     employer: new mongoose.Types.ObjectId("66d9d02e8b777bd197935973"), // Use the actual ObjectId of the employer
        //     skills: ["Python", "Machine Learning", "Data Science", "TensorFlow", "Keras"],
        //     minSalary: 6000,
        //     maxSalary: 8000,
        //     duration: 7,
        //     status: "available",
        //     applicants: [
        //         new mongoose.Types.ObjectId("66d4caf1cf636341d0521ab4"), // Replace with actual applicant ObjectIds
        //         new mongoose.Types.ObjectId("66d4cba5cf636341d0521ab8")
        //     ]
        // });
        // console.log("Freelancing Offer Inserted:", result);

        // const newApplication2 = new Application({
        //     freelancingOffer: new mongoose.Types.ObjectId("66d8a194f95d2f34f06429dd"),
        //     applicant: new mongoose.Types.ObjectId("66d4cba5cf636341d0521ab8"),
        //     proposedRate: 600,
        // });

        // // Save the new application to the database
        // newApplication2.save()
        //     .then(application => {
        //         console.log('Application successfully created:', application);
        //         mongoose.connection.close(); // Close the connection when done
        //     })
        //     .catch(err => {
        //         console.error('Error creating application:', err);
        //         mongoose.connection.close(); // Close the connection in case of an error
        //     });


    } catch (error) {
        console.log("MONGODB has connection FAILED error", error);
        process.exit(1);
    }
};

export default connectDB;
