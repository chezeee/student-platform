import snackbar from "snackbar";
import { getModal } from ".//modal";

const addButton = document.querySelector("#addBtn");
const addStudentModal = document.createElement('div');

addStudentModal.innerHTML = `<form action="#" id="studentForm">
<label for="firstName">Your name</label>
<input class="input" type="text" id="firstName" required name="firstName" autocomplete="off">
<label for="surname">Your surname</label>
<input class="input" type="text" id="surname" required name="surname" autocomplete="off">
<label for="address">Your address</label>
<input class="input" type="text" id="address" required name="address" autocomplete="off">
<label for="age">Your age</label>
<input class="input" type="number" id="age" required name="age" autocomplete="off">
<button id="btn" class="btn btn-outline">Submit</button>`;

getModal(addButton, addStudentModal);

const modal = document.querySelector('.modal');
const form = document.querySelector('#studentForm');
const submitButton = document.querySelector('#btn');
const tableBody = document.querySelector('#tbody');

let selectedRow = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = document.querySelector('#firstName').value;
  const surname = document.querySelector('#surname').value;
  const address = document.querySelector('#address').value;
  const age = document.querySelector('#age').value;

  const data = {
    firstName: firstName,
    surname: surname,
    address: address,
    age: age
  };

  try {
    let response;

    if (selectedRow) {
      const studentId = selectedRow.id.split('-')[1];
      response = await fetch(`http://localhost:3000/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
    }

    if (response.ok) {
      const newStudentData = await response.json();
      if (selectedRow) {
        updateStudentInTable(newStudentData);
        selectedRow = null;
      } else {
        appendStudentToTable(newStudentData);
      }
      resetForm();
      modal.style.display = "none";
    } else {
      console.error('Failed to submit the form');
    }

  } catch (error) {
    console.error(error);
  }
});

function updateStudentInTable(student) {
  const row = document.getElementById(`student-${student.id}`);
  if (row) {
    const firstNameCell = row.querySelector('td:nth-child(1)');
    const surnameCell = row.querySelector('td:nth-child(2)');
    const addressCell = row.querySelector('td:nth-child(3)');
    const ageCell = row.querySelector('td:nth-child(4)');

    firstNameCell.textContent = student.firstName;
    surnameCell.textContent = student.surname;
    addressCell.textContent = student.address;
    ageCell.textContent = student.age;
  }
}

function updateStudentDataInForm(student) {

  modal.style.display = "block";

  document.querySelector('#firstName').value = student.firstName;
  document.querySelector('#surname').value = student.surname;
  document.querySelector('#address').value = student.address;
  document.querySelector('#age').value = student.age;

  submitButton.removeAttribute('disabled');
}

function appendStudentToTable(student) {
  const row = document.createElement('tr');
  row.id = `student-${student.id}`;

  const firstNameCell = document.createElement('td');
  firstNameCell.textContent = student?.firstName;
  row.appendChild(firstNameCell);

  const surnameCell = document.createElement('td');
  surnameCell.textContent = student?.surname;
  row.appendChild(surnameCell);

  const addressCell = document.createElement('td');
  addressCell.textContent = student?.address;
  row.appendChild(addressCell);

  const ageCell = document.createElement('td');
  ageCell.textContent = student?.age;
  row.appendChild(ageCell);

  const actionsCell = document.createElement('td');
  actionsCell.classList.add('actions-td');

  const deleteButton = document.createElement('div');
  const editButton = document.createElement('div');

  deleteButton.innerHTML = `<i class="fa-solid fa-trash delete-icon" style="color: #b00c0c;"></i>`;
  editButton.innerHTML = `<i class="fa-solid fa-pen-to-square edit-icon" style="color: #000000;"></i>`;

  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);

  //Удаление студента
  deleteButton.addEventListener('click', () => {

    if (confirm('Are you sure you want to delete?')) {

      deleteStudent(student.id);

      snackbar.show('Пользователь удален!');

      resetForm();
      updateStudentDataInForm(student);
    }
  });

  row.appendChild(actionsCell);

  //Редактирование студента
  editButton.addEventListener('click', (event) => {
    selectedRow = event.currentTarget.closest('tr');
    updateStudentDataInForm(student);
  });

  tableBody.appendChild(row);
}

async function deleteStudent(id) {
  try {
    const response = await fetch(`http://localhost:3000/students/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete the student');
    }

    const tableRow = document.getElementById(`student-${id}`);
    tableRow.remove();
    resetForm();
    location.reload();
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    fetch('http://localhost:3000/students/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }
        return response.json();
      })
      .then(data => {
        const students = data;
        console.log(students);
        tableBody.innerHTML = '';
        students.forEach(student => {
          appendStudentToTable(student);
        });
      })
      .catch(error => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
});

function resetForm() {

  form.reset();

  submitButton.setAttribute('disabled', 'disabled');

  form.addEventListener('input', () => {
    const firstName = document.querySelector('#firstName').value;
    const surname = document.querySelector('#surname').value;
    const address = document.querySelector('#address').value;
    const age = document.querySelector('#age').value;

    if (
      firstName.trim() !== '' &&
      surname.trim() !== '' &&
      address.trim() !== '' &&
      age.trim() !== ''
    ) {
      submitButton.removeAttribute('disabled');
    } else {
      submitButton.setAttribute('disabled', 'disabled');
    }
  });
}

resetForm();