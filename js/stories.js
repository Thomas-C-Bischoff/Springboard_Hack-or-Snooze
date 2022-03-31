"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteButtonHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

// Handles Returning the Delete Button HTML
function getDeleteButtonHTML()
{
  return '<span class="trash-can"><i class="fas fa-trash-alt"></i></span>';
}

// Handles Placing a Star Next to Story If it is a User's Favorite
function getStarHTML(story, user)
{
  const isFavorite = user.isFavorite(story); // Check if the Story is the User's Favorite
  const starType = isFavorite ? "fas" : "far"; // Get Star Type Based on if the Story is Favorited or Not
  return `<span class="star"><i class="${starType} fa-star"></i></span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Handles Deleting a Story
async function deleteStory(evt)
{
  const $closetStory = $(evt.target).closest("li"); // Gets the Closest Story li Element to the Click Point
  const storyID = $closetStory.attr("id"); // Get the Stories ID
  await storyList.removeStory(currentUser, storyID); // Remove the Story
  await putUserStoriesOnPage(); // Generate the Updated Stories List
}

$myStories.on("click", ".trash-can", deleteStory); // Call deleteStory When a Trash Can Button is Clicked

// Handles the Process of Submiting a New Story
async function submitNewStory(evt)
{
  evt.preventDefault(); // Stop the Page from Reloading
  const title = $("#story-title").val(); // Get the Value Inputed for the Story's Title
  const url = $("#story-url").val(); // Get the Value Inputed for the Story's URL
  const author = $("#story-author").val(); // Get the Value Inputed for the Story's Author
  const username = currentUser.username; //Get the Current User's Username
  const storyInfo = {title, url, author, username}; // Store All the Needed Story Info
  console.debug("test 1");
  const story = await storyList.addStory(currentUser, storyInfo); // Add the New Story
  const $story = generateStoryMarkup(story); // Create a New Markup for the Story
  $allStoriesList.prepend($story); // Add the New Story to the Top of the Stories List
  $submitForm.slideUp("slow"); // Collaspe the Form
  $submitForm.trigger("reset"); // Clear the Form
}

$submitForm.on("submit", submitNewStory); // Call submitNewStory When Submit on the Form is Clicked

// Handles Displaying All the User's Stories
function putUserStoriesOnPage()
{
  $myStories.empty(); // Clear the My Stories Section
  if (currentUser.ownStories.length === 0)
  {
    $myStories.append("<h5>No stories added by user yet!</h5>"); // Display that there is no Stories Currently Created by the User
  }
  else
  {
    for (let story of currentUser.ownStories)
    {
      const $story = generateStoryMarkup(story, true); // Create a Mark up for the Story
      $myStories.append($story); // Add Story to User's Story Page
    }
  }
  $myStories.show(); // Displays the User's Stories
}

// Handles Displaying the User's Favorite Stories
function putFavoritesListOnPage()
{
  $favoritedStories.empty(); // Clear the User's Favorited Stories from the Page
  if (currentUser.favorites.length === 0)
  {
    $favoritedStories.append("<h5>No favorites added!</h5>"); // Indicate that No Stories are in the User's Favorited List
  }
  else
  {
    for (let story of currentUser.favorites)
    {
      const $story = generateStoryMarkup(story); // Create a Mark up for the Favorited Story
      $favoritedStories.append($story); // Add the Story to Favorited Page
    }
  }
  $favoritedStories.show(); // Display the Favorited Stories
}

async function toggleStoryFavorite(evt)
{
  const $target = $(evt.target); // Get the Target that is Being Clicked on
  const $closetStory = $target.closest("li"); // Get the Closest Story to the Target Click Point
  const storyID = $closetStory.attr("id"); // Get the ID of the Story
  const story = storyList.stories.find(s => s.storyId === storyID); // Get the Story at the Story ID
  if ($target.hasClass("fas"))
  {
    await currentUser.removeFavorite(story); // Remove the Story from the User's Favorite
    $target.closest("i").toggleClass("fas far"); // Toggle the Star Off
  }
  else
  {
    await currentUser.addFavorite(story); // Add the Story to User's Favorites
    $target.closest("i").toggleClass("fas far"); // Toggle the Star On
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite); // Call toggleStoryFavorite When Star is Clicked