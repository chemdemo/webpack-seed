<% list.forEach(function(item) { %>
<li class="item-<%= item.id %>">
    <h2><%= item.title %></h2>
    <p><%= item.content %></p>
</li>
<% }); %>
