import Alpine from "https://cdn.skypack.dev/alpinejs";
import kingshottIodine from "https://cdn.skypack.dev/@kingshott/iodine";

Alpine.data("form", form);
Alpine.start();

function form() {
  return {
    inputElements: [],
    init() {
      //Set up custom Iodine rules
      
      Iodine.rule(
        "matchingPassword", (value) => value === document.getElementById("password").value);
      Iodine.setErrorMessage("matchingPassword", "Password confirmation needs to match password")
      Iodine.rule("username", (value, param) => value.length >= param);
      Iodine.setErrorMessage("username", "${i18n['username.errorMessage']}");
      Iodine.messages.matchingPassword = "Password confirmation needs to match password";
      //Store an array of all the input elements with 'data-rules' attributes
      this.inputElements = [...this.$el.querySelectorAll("input[data-rules]")];
      this.initDomData();
      this.updateErrorMessages();
    },
    initDomData: function () {
      //Create an object attached to the component state for each input element to store its state
      this.inputElements.map((ele) => {
        this[ele.name] = {
          serverErrors: JSON.parse(ele.dataset.serverErrors),
          blurred: false
        };
      });
    },
    updateErrorMessages: function () {
      //map throught the input elements and set the 'errorMessage'
      this.inputElements.map((ele) => {
        Iodine.setDefaultFieldName(ele.name);
        console.log(ele.name);
        this[ele.name].errorMessage = this.getErrorMessage(ele);
      });
    },
    getErrorMessage: function (ele) {
      //Return any server errors if they're present
    //   if (this[ele.name].serverErrors.length > 0) {
    //     return input.serverErrors[0];
    //   }
      this[ele.name].serverErrors.length > 0 ? input.serverErrors[0] : null;
      //Check using iodine and return the error message only if the element has not been blurred
      const error = Iodine.assert(ele.value, JSON.parse(ele.dataset.rules));
      console.log(ele.value);
      console.log(ele.dataset.rules);
      console.log(error);
      error !== true && this[ele.name].blurred ? error.error : "";
    //   if (error !== true && this[ele.name].blurred) {
        
    //     return error.error;
    //   }
    //   return empty string if there are no errors
    //   return "";
    },
    submit: function (event) {
      const invalidElements = this.inputElements.filter((input) => {
        return Iodine.assert(input.value, JSON.parse(input.dataset.rules)) !== true;
      });
      if (invalidElements.length > 0) {
        event.preventDefault();
        document.getElementById(invalidElements[0].id).scrollIntoView();
        //We set all the inputs as blurred if the form has been submitted
        this.inputElements.map((input) => {
          this[input.name].blurred = true;
        });
        //And update the error messages.
        this.updateErrorMessages();
      }
    },
    change: function (event) {
      //Ignore all events that aren't coming from the inputs we're watching
      if (!this[event.target.name]) {
        return false;
      }
      if (event.type === "input") {
        this[event.target.name].serverErrors = [];
        
        console.log("change");
        
      }
      if (event.type === "focusout") {
        this[event.target.name].blurred = true;
      }
      //Whether blurred or on input, we update the error messages
      this.updateErrorMessages();
    }
  };
}
