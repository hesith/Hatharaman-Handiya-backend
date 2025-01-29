export default async function StoryView (db)  {
    try {
      // Drop existing view if it exists (optional, for updates)
      const views = await db.listCollections({ name: "Story" }).toArray();

      if (views.length > 0) {
        console.log("Dropping existing view: Story");
        await db.collection("Story").drop();
      }
  
      // Create the view
      console.log("Creating view: Story");
      await db.createCollection("Story", {
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
            $project: {                  // Projection to include desired fields
              _id: 1,
              userId: 1,
              title: 1,
              timestamp: 1,
              statusId: 1,
              content: 1,
              "userDetails.picture": 1,
            },
          },
          {
            $sort: {                      // Sorting by timestamp (ascending)
              timestamp: -1,             // Change to 1 for ascending
            },
          }
        ], 
      });
  
      console.log("View 'Story' created successfully.");
    } catch (error) {
      console.error("Error creating view:", error);
    }
  };
  