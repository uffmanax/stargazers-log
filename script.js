const repositoryList = document.querySelector("#repository-list");

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  if (repositories.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "status-message";
    emptyMessage.textContent = "No starred repositories yet.";
    repositoryList.append(emptyMessage);
    return;
  }

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository-card";

    const link = document.createElement("a");
    link.href = repository.url;
    link.textContent = repository.repository;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const description = document.createElement("p");
    description.textContent = repository.description;

    const date = document.createElement("time");
    date.dateTime = repository.starred_at;
    date.textContent = `Starred on ${new Date(`${repository.starred_at}T00:00:00`).toLocaleDateString()}`;

    item.append(link, description, date);
    repositoryList.append(item);
  }
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }
    renderRepositories(repositories);
  } catch (error) {
    const message = document.createElement("li");
    message.className = "status-message";
    message.textContent = "Unable to load starred repositories. Please try again later.";
    repositoryList.replaceChildren(message);
    console.error(error);
  }
}

loadRepositories();
