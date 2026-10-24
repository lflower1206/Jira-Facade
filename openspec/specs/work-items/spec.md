# work-items Specification

## Purpose

Lets users create, list, view, update, and delete Jira-style work items through the Jira Facade UI, with data persisted locally independent of any Jira backend.

## Requirements

### Requirement: Work Item Data Model
The system SHALL store each work item with: a unique key, summary, optional description, type, status, priority, optional assignee, optional reporter, and created/updated timestamps. Type SHALL be one of Task, Bug, Story, Epic. Status SHALL be one of To Do, In Progress, Done. Priority SHALL be one of Highest, High, Medium, Low, Lowest.

#### Scenario: Defaults applied on creation
- **WHEN** a work item is created without specifying type, status, or priority
- **THEN** the system stores it with type Task, status To Do, and priority Medium

#### Scenario: Timestamps recorded
- **WHEN** a work item is created
- **THEN** its created and updated timestamps are both set to the creation time

### Requirement: Work Item Key Generation
The system SHALL assign every new work item a unique, immutable key in the format `JF-<n>`, where `<n>` is a positive integer that is never reused, including after deletion.

#### Scenario: Sequential keys
- **WHEN** two work items are created one after another in an empty store
- **THEN** they receive keys `JF-1` and `JF-2`

#### Scenario: Keys not reused after delete
- **WHEN** work item `JF-2` is deleted and a new work item is created
- **THEN** the new work item does not receive key `JF-2`

### Requirement: Work Item Input Validation
The system SHALL reject create and update submissions whose summary is empty or whitespace-only, or longer than 255 characters, or whose type, status, or priority is outside the allowed values. Rejected submissions SHALL NOT change stored data and SHALL show field-level error messages while preserving entered values.

#### Scenario: Missing summary
- **WHEN** a user submits the create form with an empty summary
- **THEN** no work item is created and the form shows a "Summary is required" error with other entered values preserved

#### Scenario: Summary too long
- **WHEN** a user submits a summary of 256 characters
- **THEN** the submission is rejected with an error indicating the 255-character limit

#### Scenario: Invalid enumerated value
- **WHEN** a submission contains a status value that is not To Do, In Progress, or Done
- **THEN** the submission is rejected and stored data is unchanged

### Requirement: List Work Items
The system SHALL provide a page at `/workitems` listing all work items with key, summary, type, status, priority, assignee, and last updated time, ordered by most recently updated first.

#### Scenario: Listing existing work items
- **WHEN** a user navigates to `/workitems` and work items exist
- **THEN** all work items are displayed, most recently updated first, each linking to its detail page

#### Scenario: Empty state
- **WHEN** a user navigates to `/workitems` and no work items exist
- **THEN** the page shows an empty-state message and a link to create a work item

### Requirement: Filter Work Items by Status
The list page SHALL allow filtering work items by a single status, reflected in the page URL so the filtered view can be bookmarked or shared.

#### Scenario: Applying a status filter
- **WHEN** a user selects the "In Progress" status filter
- **THEN** only work items with status In Progress are listed and the URL includes the selected status

#### Scenario: Clearing the filter
- **WHEN** a user selects "All" statuses
- **THEN** all work items are listed

### Requirement: Create Work Item
The system SHALL provide a page at `/workitems/new` with a form to create a work item. On successful submission the work item SHALL be persisted and the user redirected to its detail page.

#### Scenario: Successful creation
- **WHEN** a user submits the create form with summary "Login fails on Safari" and type Bug
- **THEN** a work item is persisted with those values and the user is redirected to `/workitems/<key>` showing the new item

### Requirement: View Work Item
The system SHALL provide a detail page at `/workitems/<key>` displaying all fields of the work item, with actions to edit and delete it.

#### Scenario: Viewing an existing work item
- **WHEN** a user navigates to `/workitems/JF-1` and it exists
- **THEN** the page displays all of its fields and offers edit and delete actions

#### Scenario: Work item not found
- **WHEN** a user navigates to `/workitems/JF-999` and no such work item exists
- **THEN** the system responds with a not-found page

### Requirement: Update Work Item
The system SHALL provide a page at `/workitems/<key>/edit` with a form pre-filled with the current values. On successful submission the changes SHALL be persisted, the updated timestamp refreshed, the key and created timestamp left unchanged, and the user redirected to the detail page.

#### Scenario: Successful update
- **WHEN** a user changes the status of `JF-1` from To Do to In Progress and submits
- **THEN** `JF-1` is stored with status In Progress, a newer updated timestamp, and the same key and created timestamp

#### Scenario: Editing a missing work item
- **WHEN** a user navigates to `/workitems/JF-999/edit` and no such work item exists
- **THEN** the system responds with a not-found page

### Requirement: Delete Work Item
The system SHALL allow a user to permanently delete a work item only after an explicit confirmation step. After deletion the user SHALL be redirected to the list page and the work item SHALL no longer be retrievable.

#### Scenario: Confirmed deletion
- **WHEN** a user chooses delete on `JF-1` and confirms
- **THEN** `JF-1` is permanently removed and the user is redirected to `/workitems`, where it is no longer listed

#### Scenario: Cancelled deletion
- **WHEN** a user chooses delete on `JF-1` and cancels the confirmation
- **THEN** `JF-1` remains unchanged

### Requirement: Local Persistence
The system SHALL persist work items in a local database file so that data survives application restarts, without requiring any external Jira service.

#### Scenario: Data survives restart
- **WHEN** a work item is created and the application server is restarted
- **THEN** the work item is still listed on `/workitems`

### Requirement: Work Items Navigation
The global header SHALL include a "Work Items" link to `/workitems`.

#### Scenario: Navigating from the header
- **WHEN** a user clicks "Work Items" in the header
- **THEN** the user is taken to `/workitems`
