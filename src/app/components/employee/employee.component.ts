import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType, LabelItem } from 'chart.js';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent  {
employees: any[]=[] ; //array to save the list of employeer
filterName: string = ''; // For filtering by name

// Bar charts configuration
public barChartOptions: ChartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true, 
      ticks: {
        stepSize: 1, 
        callback: (tickValue: string | number) => {
          
          // Format the tick as an integer if it's a number
          return typeof tickValue === 'number' ? Math.floor(tickValue) : tickValue;
        },
      },
    },
  },
};

public barChartLabels: string[] = ['IT', 'Environmental Engineering', 'Marketing', 'Sales'];
public barChartType: ChartType = 'bar';
public barChartLegend = true;

public barChartData: ChartDataset<'bar'>[] = [
  { data: [0, 0, 0, 0], label: 'Employees Count' },
];

// Pie Chart Configuration 
public pieChartOptions: ChartOptions = {
  responsive: true,
 
};

public pieChartLabels: string[] = ['Male', 'Female', 'Other'];
public pieChartType: ChartType = 'pie';
public pieChartLegend = true;

public pieChartData: ChartDataset<'pie'>[] = [
  { data: [0, 0, 0], label: 'Gender Distribution' },
];

//add employee
onSubmit(form: any){
  const newEmployee = {
    fullName: form.value.fullName,
    email: form.value.email,
    department: form.value.department,
    gender: form.value.gender
  };
  this.employees.push(newEmployee)
  this.updateChartData(); 
  form.reset(); 
  console.log(this.employees);
}
//delete employee
deleteEmployee(index: number) {
  this.employees.splice(index, 1);  
  this.updateChartData();
}
//Chart update 
updateChartData() {
  // Initialize counts for each department
  const departmentCounts: { IT: number; 'Environmental Engineering': number; Marketing: number; Sales: number } = {
    IT: 0,
    'Environmental Engineering': 0,
    Marketing: 0,
    Sales: 0,
  };

  // Initialize counts for gender categories
  const genderCounts: { Male: number; Female: number; Other: number } = {
    Male: 0,
    Female: 0,
    Other: 0,
  };

  // Loop through employees and count by department and gender
  this.employees.forEach((employee) => {
    const department = employee.department as keyof typeof departmentCounts; // Get department type
    const gender = employee.gender as keyof typeof genderCounts; // Get gender type

    // Increment the count for the department if it exists
    if (departmentCounts[department] !== undefined) {
      departmentCounts[department]++;
    }

    // Increment the count for the gender if it exists
    if (genderCounts[gender] !== undefined) {
      genderCounts[gender]++;
    } else {
      genderCounts['Other']++;  
    }
  });

  // Update bar chart data with the counts of each department
  this.barChartData = [
    {
      data: [
        departmentCounts['IT'],
        departmentCounts['Environmental Engineering'],
        departmentCounts['Marketing'],
        departmentCounts['Sales'],
      ],
      label: 'Employees Count',
    },
  ];

  // Update pie chart data for gender distribution
  this.pieChartData = [
    {
      data: [genderCounts['Male'], genderCounts['Female'], genderCounts['Other']],
      label: 'Gender Distribution',
    },
  ];

  // Log the updated chart data to the console for debugging
  console.log('Updated bar chart data:', this.barChartData);
  console.log('Updated pie chart data:', this.pieChartData);
}



// Method to sort employees by name
sortByName() {
  this.employees.sort((a, b) => a.fullName.localeCompare(b.fullName));
}

// Method to sort employees by department
sortByDepartment() {
  this.employees.sort((a, b) => a.department.localeCompare(b.department));
}
// Method search by name
filteredEmployees() {
  if (!this.filterName) {
    return this.employees;
  }
  return this.employees.filter(employee =>
    employee.fullName.toLowerCase().includes(this.filterName.toLowerCase())
  );
}

}
