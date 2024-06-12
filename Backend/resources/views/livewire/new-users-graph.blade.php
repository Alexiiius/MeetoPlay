<div class="bg-base-200 p-4 px-8 flex gap-3 items-center w-min rounded-lg">
  <canvas id="newUsersChart" width="460" height="400"></canvas>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    var ctx = document.getElementById('newUsersChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: {!! json_encode(array_keys($newUsers->toArray())) !!},
            datasets: [{
                label: 'New Users',
                data: {!! json_encode(array_values($newUsers->toArray())) !!},
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  });
</script>
