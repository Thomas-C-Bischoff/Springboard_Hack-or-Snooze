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

// Handles Showing the Submit Story Form to the User When Submit is Clicked
function navSubmitStory(evt)
{
  console.debug("Submit");
  hidePageComponents(); // Hide All Page Components
  $allStoriesList.show(); // Display All Stories List
  $submitForm.show(); // Display the Submit Story Form
}

$navSubmitStory.on("click", navSubmitStory); // Call navSubmitStory When Submit is Clicked

// Handles Showing the User's Favorites When Favorites is Clicked
function navFavoritesClicked(evt)
{
  hidePageComponents(); // Hide All Page Components
  putFavoritesListOnPage(); // Display Favorite Stories
}

$body.on("click", "#nav-favorites", navFavoritesClicked); // Call navFavoritesClicked When Favorites is Clicked

// Handles Display the User's Stories
function navMyStories(evt)
{
  hidePageComponents(); // Hide All Page Components
  putUserStoriesOnPage(); // Display the User's Stoies
  $myStories.show();
}

$body.on("click", "#nav-my_stories", navMyStories); // Call navMyStories When My Stories is Clicked

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

// Handles Displaying the User's Profile
function navProfileClicked(evt)
{
  hidePageComponents(); // Hide All Page Componetns
  $userProfile.show(); // Display the User's Profile
}

$navUserProfile.on("click", navProfileClicked) // Call navProfileClicked When User Profile is Clicked

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserLinks.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
