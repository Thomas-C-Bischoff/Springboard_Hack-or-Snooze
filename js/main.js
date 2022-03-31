"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $storiesLists = $(".stories-list"); // Array of All the Stories Lists
const $allStoriesList = $("#all-stories-list");
const $favoritedStories = $("#favorite-stories-list"); // Ordered List Used to Contain the User's Favorited Stories
const $myStories = $("#my-stories"); // Ordered List Used to Contain the User's Created Stories

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $userProfile = $("#user-profile") // Section that Contains the User's Information

const $navUserLinks = $(".navbar-user_links")
const $navSubmitStory = $("#nav-submit_story"); // Link to Where User Can Submit a Story
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

const $submitForm = $("#form-submit") // Formed Used to Submit a New Story

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $storiesLists,
    $loginForm,
    $signupForm,
    $userProfile,
    $submitForm
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
