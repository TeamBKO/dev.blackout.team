export default {
  data() {
    return {
      policies: [],
      startingPolicies: [],
    };
  },

  computed: {
    relatePolicies() {
      return this.policies.some((id) => !this.startingPolicies.includes(id));
    },

    addPolicies() {
      return this.policies.filter(
        (policy) => !this.startingPolicies.includes(policy)
      );
      // return this.enabledPolicies.reduce((arr, policy) => {
      //   if (!this.startingPolicies.includes(policy)) {
      //     arr.push(policy);
      //   }
      //   return arr;
      // }, []);
    },

    removePolicies() {
      return this.startingPolicies.filter(
        (policy) => !this.policies.includes(policy)
      );
      // return this.startingPolicies.reduce((arr, policy) => {
      //   if (!this.enabledPolicies.includes(policy)) {
      //     arr.push(policy);
      //   }
      //   return arr;
      // }, []);
    },

    unrelatePolicies() {
      return this.startingPolicies.length
        ? this.startingPolicies.some((id) => !this.policies.includes(id))
        : false;
    },
  },
};
