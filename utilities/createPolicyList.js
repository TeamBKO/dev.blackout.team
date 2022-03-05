export default function createPolicyList(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('argument arr is not an array.');
  }

  return arr.reduce((output, policy) => {
    const action = policy.action,
      target = policy.target,
      resource = policy.resource,
      id = policy.id;
    if (output[resource]) {
      output[resource].push({ id, action, target, enable: false });
    } else {
      output[resource] = [];
      output[resource].push({ id, action, target, enable: false });
    }
    return output;
  }, {});
}
