<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const unique = uniqueById(reports as Report[]);
  const merged = unique.filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const wrongTags = groups.reduce(
    (total, g) => total + g.reports.filter((r) => r.meta.intakeTag !== g.cause).length, 0
  );
  const wave = merged.filter((r) => r.mergedAt?.startsWith('2026-07-02'));
  const beforeWave = merged.filter((r) => r.receivedAt.slice(0, 10) < '2026-07-02');
  const followUp = merged.filter((r) => notes.oneDayMove.includes(r.id));
  const months = [...new Set(merged.map((r) => r.receivedAt.slice(0, 7)))].sort();
</script>

<p>
  The export has <strong>{reports.length}</strong> rows and <strong>{unique.length}</strong>
  unique report IDs: <strong>{reports.length - unique.length}</strong> repeated rows are not
  additional customers or incidents. All <strong>{merged.length}</strong> unique reports
  were merged into #4471. Tenant-based classification disagrees with intake tags on
  <strong>{wrongTags}</strong> reports.
</p>

<h2>Received is not merged</h2>
<p>
  <strong>{beforeWave.length}</strong> reports arrived before 2 July.
  The desk merged <strong>{wave.length}</strong> reports on 2 July. That merge-day spike
  is a backlog-processing event, not evidence that the bugs began that day.
</p>
<table>
  <thead>
    <tr>
      <th>received month</th>
      {#each groups as g (g.cause)}<th>{g.cause}</th>{/each}
      <th>total</th>
    </tr>
  </thead>
  <tbody>
    {#each months as month (month)}
      <tr>
        <td>{month}</td>
        {#each groups as g (g.cause)}
          <td>{g.reports.filter((r) => r.receivedAt.startsWith(month)).length}</td>
        {/each}
        <td>{merged.filter((r) => r.receivedAt.startsWith(month)).length}</td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>One-day reports: retain the evidence</h2>
<p>
  The desk flagged <strong>{followUp.length}</strong> reports as one-day moves.
  They remain included, not added again, in the parser count under the supplied
  tenant classifier. Their descriptions need investigation: this export does not
  establish a timezone or daylight-saving root cause. Do not silently call these
  confirmed month/day reproductions.
</p>
<table>
  <thead><tr><th>report</th><th>tenant / channel</th><th>original report</th></tr></thead>
  <tbody>
    {#each followUp as r (r.id)}
      <tr><td>{r.id}</td><td>{r.tenant} / {r.channel}</td><td>{r.body}</td></tr>
    {/each}
  </tbody>
</table>
