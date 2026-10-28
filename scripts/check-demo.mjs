import assert from 'node:assert/strict'
import { firstAttack, sampleBoss } from '../src/presentation/demo-model.ts'

const pose = ({ playerX, bulletX, bulletY }) => ({ playerX, bulletX, bulletY })
assert.deepEqual(pose(sampleBoss(120)), firstAttack(119), 'Rollback starts at the recorded end state')
assert.deepEqual(pose(sampleBoss(179)), firstAttack(0), 'Rollback restores player and bullet state')
assert.deepEqual(pose(sampleBoss(180)), firstAttack(0), 'Re-simulation starts from the restored state')
assert.equal(sampleBoss(285).bulletX, 490, 'The second attack targets the previous dodge position')
assert.equal(sampleBoss(285).playerX, 490)
assert.equal(sampleBoss(285).hit, true)
for (let f = 121; f < 180; f++) {
  assert.ok(sampleBoss(f).time < sampleBoss(f - 1).time, 'Recorded time runs backwards')
  assert.ok(sampleBoss(f).bulletY <= sampleBoss(f - 1).bulletY, 'The projectile also rewinds')
}
assert.deepEqual(sampleBoss(360), sampleBoss(0), 'The demo loops')
console.log('Boss demo: snapshot, rollback, re-simulation and loop checks passed.')
