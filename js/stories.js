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

function generateStoryMarkup(story, canDelete = false) {
  // console.debug("generateStoryMarkup", story);
  const hasStar = Boolean(currentUser);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${canDelete ? displayDeleteButton() : ""}
        ${displayStar ? displayStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function displayDeleteButton()
{
  // Return the html string to display the delete button
  return <span class="trash-can"><i class="fas fa-trash-alt"></i></span>;
}

function displayStar(story, user)
{
  // Check if the story is favorited
  const isFavorite = user.isFavorite(story);
  // Set the stars fill type based on if it is favorited or not
  const starType = isFavorite ? "fas" : "far";
  // Returns the stars html string
  return <span class="star"><i class="${starType} fa-star"></i></span>;
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

async function deleteStory(evt)
{
  // Get the closest listed story to where the event occured.
  const $closestStory = $(evt.target).closest("li");
  // Get the closest story ID.
  const storyID = $closestStory.attr("id");
  // Removes the story
  await storyList.removeStory(currentUser, storyID);
  // Displays the updated page
  await displayUserStories();
}

async function submitStory(evt)
{
  // Prevents the page from being refreshed when submit is clicked.
  evt.preventDefault();
  // Get the author's given name.
  const author = $("#author").val();
  // Get the title of the story.
  const title = $("#title").val();
  // Get the story's url
  const url = $("#url").val();
  // Get the current users username
  const username = currentUser.username;
  // Create the Story
  const newStory = await storyList.addStory(currentUser, {title, url, author, username});
  // Generate the story markup
  const $newStory = generateStoryMarkup(newStory);
  // Add the new story to the top of the stories list.
  $allStoriesList.prepend($newStory);
  // Hide the form
  $("#story-form").slideUp("slow");
  // Reset the form
  $("#story-form").trigger("reset");
}

function displayUserStories()
{
  // Empties the user html stories list
  $userStories.empty();
  // Check if the list of user stories is empty
  if (currentUser.ownStories.length === 0)
  {
    // Display that the user has no stories
    $userStories.append("<h4>No Stories Added by the User Yet!</h4>");
  }
  else
  {
    // Go through the list of user stories
    for (story of currentUser.ownStories)
    {
      // Create a markup of the story which can be deleted
      const $story = generateStoryMarkup(story, true);
      // Append the story to html list of user stories
      $userStories.append($story);
    }
  }
  // Make the user stories visible
  $userStories.show();
}

function displayUsersFavorites()
{
  // Empties the favorites html stories list.
  $favoriteStories.empty();
    // Check if the list of favorite stories is empty
    if (currentUser.favorites.length === 0)
    {
      // Display that the user has no favorites
      $favoriteStories.append("<h4>No Favorites Add!</h4>");
    }
    else
    {
      // Go through the list of favorite stories
      for (story of currentUser.favorites)
      {
        // Create a markup of the story
        const $story = generateStoryMarkup(story);
        // Append the story to html list of favorite stories
        $favoriteStories.append($story);
      }
    }
    // Make the favorite stories visible
    $favoriteStories.show();
}

async function toggleFavorite(evt)
{
  // Get the event targets html element.
  const $target = $(evt.target);
  // Find the closets story to the target
  const $closestStory = $target.closest("li");
  // Get the id of the closest story.
  const storyID = $closestStory.attr("id");
  // 
  const story = storyList.stories.find(s => s.storyId === storyID);
  // Check if the story is favorited
  if ($target.hasStar("fas"))
  {
    // Remove the story from favorited
    await currentUser.unfavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
  else
  {
    // Add the story to favorites
    await currentUser.favorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$storyLists.on("click", ".star", toggleFavorite);