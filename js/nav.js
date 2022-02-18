"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function navSubmitStory(evt)
{
  // Hide all the pages components
  hidePageComponents();
  // Display the story form
  $storyForm.show();
  // Display all the stories
  $allStoriesList.show();
}

$navSubmit.on("click", navSubmitStory)

function navFavoriteStories(evt)
{
  // Hide all the pages components
  hidePageComponents();
  // Displays the users favorites
  displayUsersFavorites();
}

$navFavorites.on("click", navFavoriteStories);

function navUserStories(evt)
{
  // Hide all the pages components.
  hidePageComponents();
  // Displays the user stories
  displayUserStories();
  $userStories.show();
}

$navUserStories.on("click", navUserStories);

function navProfile()
{
  // Hide all the pages components.
  hidePageComponents();
  // Show the user's profile
  $userProfile.show();
}

$navUserProfile.on("click", navProfile);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
