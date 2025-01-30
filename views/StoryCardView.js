export default async function StoryCardView (db)  {
    try {
      // Drop existing view if it exists (optional, for updates)
      const views = await db.listCollections({ name: "StoryCard" }).toArray();

      if (views.length > 0) {
        console.log("Dropping existing view: StoryCard");
        await db.collection("StoryCard").drop();
      }
  
      // Create the view
      console.log("Creating view: StoryCard");
      await db.createCollection("StoryCard", {
        viewOn: "stories", // Source collection
        pipeline: [
          {
            $lookup: {
              from: "usersGoog",          // Collection to join
              localField: "userId",   // Field in orders
              foreignField: "_id",        // Field in customers
              as: "userDetails",      // Joined data
            },
          },
          {
            $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: "total_likes",       // Collection to join with
              localField: "_id", // Field in 'orders' that holds an array of productIds
              foreignField: "_id",    // Field in 'products' collection
              as: "likesDetails"     // Output array field that will store the joined product data
            }
          },
          {
            $project: {                  // Projection to include desired fields
              _id: 1,
              userId: 1,
              title: 1,
              timestamp: 1,
              statusId: 1,
              "userDetails.picture": 1,
              totalLikes: { 
                $arrayElemAt: ["$likesDetails.likes", 0]  // Extract the first department name
              }
            },
          },
          {
            $sort: {                      // Sorting by timestamp (ascending)
              timestamp: -1,             // Change to 1 for ascending
            },
          }
        ], 
      });
  
      console.log("View 'StoryCard' created successfully.");
    } catch (error) {
      console.error("Error creating view:", error);
    }
  };
  