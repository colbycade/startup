# Family Chore Tracker

This is a web application that allows families to efficiently plan and track tasks and events at home.

## Specification Deliverable
### Elevator pitch

Does your family struggle to keep track of everything going on in your busy lives or wonder if the dog has been fed yet? The Family Chore Tracker application makes it so you and your family can easily and collaboratively keep track of everything you need to get done at home. Each member of the family has a personal chore list, and there is also a joint family list. Parents can assign tasks to the personal list of a child. With this app, there will be no doubt who's turn it is to wash the dishes after dinner.

### Design

![Mock](mock.png)

### Key features

- Secure login over HTTPS
- Ability to create tasks
- Display of all tasks for both family and personal lists
- Ability to move tasks between family and personal lists 
- Ability to edit the status of a task (to-do, completed)
- Only parents can remove tasks or assign them to a specific child
- Tasks are sorted by due date
- Repeatable tasks are supported


### Technologies

I am going to use the required technologies in the following ways

- **HTML** - Uses correct HTML structure for application. Two HTML pages. One for login and one for seeing to-do lists. 
- **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- **JavaScript** - Provides login, chore display, adding/removing/completing chores, display other users votes, backend endpoint calls.
- **Service** - Backend service with endpoints for:
  - login
  - retrieving tasks
  - submitting tasks
- **DB/Login** - Store users and tasks in database. Register and login users. Credentials securely stored in database. 
- **WebSocket** - Task list status is updated in real time.
- **React** - Application ported to use the React web framework.


## HTML Deliverable

I created the HTML structure for each page of the web application:
- `**Login.html**` - used to authenticate/register users
  - Input forms for DB/Login
- `**Home.html**` - used to display and interact with various task lists
  - display real-time status of task lists with WebSocket
  - placeholder image for user's profile picture
  - dropdown to select a specific task list
  - placeholder table for displaying tasks of selected list from Database
- `**About.html**` - used to provide information about how to use web application
- `**Calendar.html**`  - used to display tasks throughout the month using WebSocket data

I added a consistent navigation menu that links between the pages. The login buttons link to the home page.  
I added some textual content such as basic instructions for how the app will be used. I also put placeholders for where the WebSocket data will be used to populate the task list tables and calendar display, as well as placeholder login forms for the database data.
