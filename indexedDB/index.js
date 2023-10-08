var db;
var request = window.indexedDB.open("DBNew", 1);

request.onerror = function (e) {
  alert(e);
};

request.onsuccess = function () {
  db = request.result;
  ReadAll(); // Load existing users from the database when the page loads
};

request.onupgradeneeded = function (e) {
  db = e.target.result;
  var objectStore = db.createObjectStore("employee", { keyPath: "id" });
};

function Save() {
  var transaction = db.transaction(["employee"], "readwrite");
  var objectStore = transaction.objectStore("employee");

  var user = {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    email: document.getElementById("email").value,
  };

  var request = objectStore.add(user);

  request.onerror = function (e) {
    alert(`Unable to add data. ${user.name} already exists.`);
  };

  request.onsuccess = function () {
    displayUser(user);
  };
}

function Read() {
  var transaction = db.transaction(["employee"]);
  var objectStore = transaction.objectStore("employee");

  var request = objectStore.get(document.getElementById("id").value);

  request.onerror = function (e) {
    alert(e);
  };

  request.onsuccess = function () {
    var user = request.result;
    if (user) {
      displayUser(user);
    } else {
      alert(`${document.getElementById("id").value} not found`);
    }
  };
}

function displayUser(user) {
  var table = document.getElementById("userTable");
  var existingRow = findUserRow(user.id);

  if (existingRow) {
    // Update existing row
    existingRow.cells[1].textContent = user.name;
    existingRow.cells[2].textContent = user.age;
    existingRow.cells[3].textContent = user.email;
  } else {
    var newRow = table.insertRow();

    var idCell = newRow.insertCell();
    idCell.textContent = user.id;

    var nameCell = newRow.insertCell();
    nameCell.textContent = user.name;

    var ageCell = newRow.insertCell();
    ageCell.textContent = user.age;

    var emailCell = newRow.insertCell();
    emailCell.textContent = user.email;

    var actionCell = newRow.insertCell();
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deleteUser(user.id);
    });
    actionCell.appendChild(deleteButton);
  }
}

function findUserRow(id) {
  var table = document.getElementById("userTable");
  for (var i = 0; i < table.rows.length; i++) {
    if (table.rows[i].cells[0].textContent === id) {
      return table.rows[i];
    }
  }
  return null;
}

function Edit() {
  var transaction = db.transaction(["employee"], "readwrite");
  var objectStore = transaction.objectStore("employee");

  var user = {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    email: document.getElementById("email").value,
  };

  var request = objectStore.put(user);

  request.onerror = function (e) {
    alert(e);
  };

  request.onsuccess = function () {

    displayUser(user); // Update the user in the table
  };
}

function deleteUser(id) {
  var transaction = db.transaction(["employee"], "readwrite");
  var objectStore = transaction.objectStore("employee");

  var request = objectStore.delete(id);

  request.onerror = function (e) {
    alert(e);
  };

  request.onsuccess = function () {
  
    removeUserFromTable(id);
  };
}

function removeUserFromTable(id) {
  var table = document.getElementById("userTable");
  for (var i = 0; i < table.rows.length; i++) {
    if (table.rows[i].cells[0].textContent === id) {
      table.deleteRow(i);
      break;
    }
  }
}

function ReadAll() {
  var transaction = db.transaction(["employee"]);
  var objectStore = transaction.objectStore("employee");

  var request = objectStore.openCursor();

  request.onsuccess = function (e) {
    var cursor = e.target.result;
    if (cursor) {
      displayUser(cursor.value);
      cursor.continue();
    } else {
      alert("No more data");
    }
  };
}