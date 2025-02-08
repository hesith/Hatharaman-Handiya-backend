export default async function StoryView (db)  {
    try {
      // Drop existing view if it exists (optional, for updates)
      const views = await db.listCollections({ name: "Comments" }).toArray();

      if (views.length > 0) {
        console.log("Dropping existing view: Comments");
        await db.collection("Comments").drop();
      }
  
      // Create the view
      console.log("Creating view: Comments");
      await db.createCollection("Comments", {
        viewOn: "comments", // Source collection
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
            $project: {                  // Projection to include desired fields
              _id: 1,
              storyId: 1,
              commentorUserId: "$userId",
              timestamp: 1,
              comment: 1,
              commentorPicture: "$userDetails.picture",
              commentorName: "$userDetails.name"
            },
          },
          {
            $sort: {                      // Sorting by timestamp (ascending)
              timestamp: -1,             // Change to 1 for ascending
            },
          }
        ], 
      });
  
      console.log("View 'Comments' created successfully.");
    } catch (error) {
      console.error("Error creating view:", error);
    }
  };
  