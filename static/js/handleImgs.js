export function readAsDataURL(file) {
	return new Promise((resolve, reject) => {
		let fileReader = new FileReader();
		fileReader.onload = function () {
			return resolve(fileReader.result);
		};
		fileReader.readAsDataURL(file);
	});
}

// Update hidden input for imgs
export function updateHidden(images) {
	$("#hiddenImgsInput").empty();

	$.each(images, function (index, file) {
		var $input = $("<input>").attr({
			type: "hidden",
			name: "imgs[]",
			value: file,
		});
		$("#hiddenImgsInput").append($input);
	});
}

// Update div for preview imgs
// hidden true for hide del btn
export function updatePreview(imgsArr, hidden = true, query = "#preview") {
	$(query).empty();

	$.each(imgsArr, function (index, file) {
		var $div = $("<div>").addClass("col-4").css({
			position: "relative",
			height: "300px",
		});
		var $img = $("<img>").attr("src", file).css({
			width: "100%",
			height: "100%",
			"object-fit": "cover",
			"border-radius": "0.375rem",
		});
		var $btn = $("<button>")
			.attr({
				type: "button",
				id: "deleteImgButton",
				"data-index": index,
			})
			.addClass("btn btn-danger")
			.css({
				position: "absolute",
				top: "4%",
				right: "4%",
			});
		hidden && $btn.attr("hidden", true);
		$btn.html(`<i class="bi bi-trash"></i>`);
		$btn.on("click", () => handleDelImg(imgsArr, $btn));

		$div.append($img);
		$div.append($btn);
		$(query).append($div);
	});
}

export function checkFilesSize(imgsArr, files) {
	let sum = 0;
	imgsArr.map((img) => (sum += img.length / 1024 / 1024));
	files.map((file) => (sum += file.size / 1024 / 1024));
	const imgsInput = document.querySelector("input#file");
	const submitBtn = document.querySelector('button[type="submit"]');
	if (sum > 10) {
		imgsInput.classList.add("is-invalid");
		!submitBtn.classList.contains("disabled") && submitBtn.classList.add("disabled");
		return false;
	} else {
		imgsInput.classList.contains("is-invalid") && imgsInput.classList.remove("is-invalid");
		submitBtn.classList.contains("disabled") && submitBtn.classList.remove("disabled");
		return true;
	}
}

// Handle click delete img button
export function handleDelImg(imgsArr, ele) {
	const id = ele.attr("data-index");
	imgsArr = imgsArr.filter((item, index) => {
		return index != id;
	});

	updatePreview(imgsArr, false);
	updateHidden(imgsArr);
}
