// MongoDB operators -> Powerfull

// Logical Operators

// $inc - increment operator, +1 +2 +3, -1 -2 -3
// $min - to find the minimum
// $max - to find the maximum
// $set - used to set a data
// book.title = "xyz"
// $unset - removing a property from an object

// Array operators

// $push - to push an element in the end of an array
// $pop - used to extract/remove the last element
// $pull - to fetch an particular element
// Example:
pull: {
    name: "xyz"
}
// $addToSet - returns an array of all unique values that results from applying an expression to each document in a group.