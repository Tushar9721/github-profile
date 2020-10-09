const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const search = document.getElementById("search");
const form = document.getElementById("form");

async function getUser(username) {
  const resp = await fetch(APIURL + username);
  const respData = await resp.json();

  if (respData.message != "Not Found") {
    createUserCard(respData);
    getRepos(username);
  }
}

async function getRepos(username) {
  const resp = await fetch(APIURL + username + "/repos");
  const respData = await resp.json();

  addReposToCard(respData);
}

function createUserCard(user) {
  const cardHTML = `
  <div class="card">
        <div>
            <img class="avatar" src="${user.avatar_url}" alt="${user.name}"/>
        </div>
        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}</p>

            <ul class="info">
                <li>${user.followers}<strong>Followers</strong></li>
                <li>${user.following}<strong>Following</strong></li>
                <li>${user.public_repos}<strong>Repos</strong></li>
            </ul>
            <div class="repos" id="repos"></div>
        </div> 
    </div>
  `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  if (repos.length === 0) {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.innerText = "No Repos Available";

    reposEl.appendChild(repoEl);
  } else {
    repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 8)
      .forEach((repo) => {
        const repoEl = document.createElement("a");
        repoEl.classList.add("repo");

        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = repo.name;

        reposEl.appendChild(repoEl);
      });
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUser(user);
    search.value = "";
  }
});
