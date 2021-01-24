-- List the following details of each employee: employee number, last name, first name, sex, and salary.

select
	ed.emp_no,
	ed.last_name,
	ed.first_name,
	ed.sex,
	s.salary
from
	employees_demo ed
join salaries s on ed.emp_no = s.emp_no

-- List first name, last name, and hire date for employees who were hired in 1986.

select
	first_name,
	last_name,
	hire_date
from
	employees_demo
where
	extract(year from hire_date) = 1986


-- List the manager of each department with the following information: department number, department name, the manager's employee number, last name, first name.

select
	dm.dept_no,
	d.dept_name,
	dm.emp_no,
	ed.last_name,
	ed.first_name
from
	dept_manager dm
join departments d on dm.dept_no = d.dept_no
join employees_demo ed on dm.emp_no = ed.emp_no

	
-- List the department of each employee with the following information: employee number, last name, first name, and department name.

select
	ed.emp_no,
	ed.last_name,
	ed.first_name,
	d.dept_name
from
	departments d
join dept_emp de on d.dept_no = de.dept_no
join employees_demo ed on de.emp_no = ed.emp_no

-- List first name, last name, and sex for employees whose first name is "Hercules" and last names begin with "B."

select
	first_name,
	last_name,
	sex
from
	employees_demo
where
	first_name = 'Hercules' and last_name LIKE 'B%'

-- List all employees in the Sales department, including their employee number, last name, first name, and department name.

select
	ed.emp_no,
	ed.last_name,
	ed.first_name,
	d.dept_name
from
	departments d
join dept_emp de on d.dept_no = de.dept_no
join employees_demo ed on de.emp_no = ed.emp_no
where dept_name = 'Sales'
	
-- List all employees in the Sales and Development departments, including their employee number, last name, first name, and department name.

select
	ed.emp_no,
	ed.last_name,
	ed.first_name,
	d.dept_name
from
	departments d
join dept_emp de on d.dept_no = de.dept_no
join employees_demo ed on de.emp_no = ed.emp_no
where dept_name = 'Sales' or dept_name = 'Development'

-- In descending order, list the frequency count of employee last names, i.e., how many employees share each last name.

select
	last_name,
	count(*)
from
	employees_demo
group by
	last_name
order by
	count(*) desc