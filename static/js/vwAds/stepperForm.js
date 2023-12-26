let step = 1;
const maxStep = 3;
$("#step-count").html(step);
function increase() {
	$(`#step-${step}`).addClass("d-none");
	step = step + 1;
	if (step == +maxStep) {
		$("#btn-next").attr("disabled", "true");
		$("#btn-next").addClass("d-none");
		$("#btn-submit").removeClass("d-none");
	}
	if ($("#btn-back").attr("disabled")) {
		$("#btn-back").removeAttr("disabled");
	}
	$(`#step-${step}`).removeClass("d-none");
	$("#step-count").html(step);
}
function decrease() {
	$(`#step-${step}`).addClass("d-none");
	step = step - 1;
	if (step == 1) {
		$("#btn-back").attr("disabled", "true");
	}
	if ($("#btn-next").attr("disabled")) {
		$("#btn-next").removeClass("d-none");
		$("#btn-submit").addClass("d-none");
		$("#btn-next").removeAttr("disabled");
	}
	$(`#step-${step}`).removeClass("d-none");
	$("#step-count").html(step);
}
$("#btn-back").on("click", decrease);
$("#btn-next").on("click", increase);
