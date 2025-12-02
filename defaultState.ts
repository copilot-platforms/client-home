const brandNameAutofill = `
  <span
    data-type="mention"
    class="autofill-pill"
    data-id="{{workspace.brandName}}"
  >
    {{workspace.brandName}}
  </span>
`;

export const defaultState = `
<notification_widget></notification_widget>

<callout>
  This page is an example. Edit the content and add a banner image in your
  Client Home app to give your clients a personalized experience when they open
  up the client portal.
  <br /><br />
  The action items widget will show client notifications for actions they have
  to take (in real-time), if they have any.
</callout>

<h2>
  Welcome, 
  <span
    data-type="mention"
    class="autofill-pill"
    data-id="{{__client__.givenName}}"
    >{{__client__.givenName}}
  </span>
</h2>
<p></p>

<p>Welcome to your ${brandNameAutofill} client portal.</p>

<p>
  This portal is your all-in-one experience while working with ${brandNameAutofill} where you can view and complete important tasks and connect with our team.
</p>
<p></p>

<p>Here are our Working Hours:</p>

<table>
  <tbody>
    <tr>
      <th class="font-bold" colspan="1" rowspan="1">
        <p>Days</p>
      </th>
      <th class="font-bold" colspan="1" rowspan="1">
        <p>Hours (EST)</p>
      </th>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">
        <p>M-F</p>
      </td>
      <td colspan="1" rowspan="1">
        <p>9AM - 6PM</p>
      </td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">
        <p>Sat</p>
      </td>
      <td colspan="1" rowspan="1">
        <p>9AM - 6PM</p>
      </td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">
        <p>Sun</p>
      </td>
      <td colspan="1" rowspan="1">
        <p>Closed</p>
      </td>
    </tr>
  </tbody>
</table>

<h2>How to use the ${brandNameAutofill} portal</h2>
<p></p>

<p>
  Save the link to this portal. If you miss an email notification, you can
  always log in and check this portal for reminders on important tasks and
  actions required. Explore the options on your left sidebar. We may add more
  options tailored to your experience.
</p>
<p></p>

<h3>💬&nbsp;Messages</h3>
<p>Questions? Chat with the ${brandNameAutofill} team and get answers.</p>
`;
