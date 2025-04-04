import { all as allRules } from "@vee-validate/rules";
import customRules from "@/plugins/vee-validate/rules";
import { configure, defineRule } from "vee-validate";
import fa from "@vee-validate/i18n/dist/locale/fa.json";
import { localize, setLocale } from "@vee-validate/i18n";

const addRulesToVeeValidate = (rules) => {
  Object.entries(rules).forEach(([ruleName, ruleFunction]) => {
    defineRule(ruleName, ruleFunction);
  });
};

export default function veeValidate() {
  addRulesToVeeValidate(allRules);
  addRulesToVeeValidate(customRules);

  setLocale("fa");

  configure({
    validateOnBlur: false,
    validateOnInput: true,
    validateOnChange: false,
    generateMessage: localize({ fa }),
  });
}
