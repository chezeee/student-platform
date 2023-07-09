import snackbar from "snackbar";

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
  const deleteButton = document.createElement('button');

  deleteButton.textContent = 'x';

  deleteButton.addEventListener('click', () => {
    deleteStudent(student.id);

    snackbar.show('Пользователь удален!');

    resetForm();
    updateStudentDataInForm(student);
  });

  actionsCell.appendChild(deleteButton);
  row.appendChild(actionsCell);

  row.addEventListener('click', () => {
    selectedRow = row;
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