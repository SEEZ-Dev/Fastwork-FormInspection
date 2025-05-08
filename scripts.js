
let times = ["09:00"];
let selectedTime = times[0];
let editIndex = -1;
let editOldTime = "";
const editModal = document.getElementById("edit-time-modal");
const editInput = document.getElementById("edit-time-input");
const saveBtn = document.getElementById("save-time-btn");
const cancelBtn = document.getElementById("cancel-time-btn");

saveBtn.onclick = () => {
  const newTime = editInput.value;
  if (!newTime || times.includes(newTime)) {
    alert("เวลาไม่ถูกต้องหรือซ้ำกัน");
    return;
  }
  times[editIndex] = newTime;
  if (selectedTime === editOldTime) selectedTime = newTime;
  closeModal();
  renderTimeSelector();
  renderForm();
};

cancelBtn.onclick = closeModal;

function openModal(time, index) {
  editOldTime = time;
  editIndex = index;
  editInput.value = time;
  editModal.classList.add("show");
}

function closeModal() {
  editModal.classList.remove("show");
  editIndex = -1;
  editOldTime = "";
}

const odFormData = {};

function renderTimeSelector() {
  const selector = document.getElementById("time-selector");
  selector.innerHTML = "";
  times.sort();

  times.forEach((time, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "time-selector-item" + (time === selectedTime ? " active" : "");
    wrapper.onclick = () => {
      selectedTime = time;
      renderTimeSelector();
      renderForm();
    };

    const menu = document.createElement("div");
    menu.className = "menu-container";

    const input = document.createElement("input");
    input.type = "time";
    input.value = time;
    input.className = "time-input";
    input.disabled = true;

    const menuBtn = document.createElement("button");
    menuBtn.className = "menu-btn";
    menuBtn.innerHTML = "⋮";
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      const dropdown = wrapper.querySelector(".menu-dropdown");
      dropdown.classList.toggle("show");
    };

    const dropdown = document.createElement("div");
    dropdown.className = "menu-dropdown";
    dropdown.innerHTML = `
      <div class="menu-item" data-action="edit">✏️ แก้ไข</div>
      <div class="menu-item" data-action="delete">🗑️ ลบ</div>
    `;
    dropdown.onclick = (e) => {
      e.stopPropagation();
      const action = e.target.dataset.action;
      if (action === "edit") {
        openModal(time, index);
        if (newTime && !times.includes(newTime)) {
          times[index] = newTime;
          if (selectedTime === time) selectedTime = newTime;
          renderTimeSelector();
          renderForm();
        } else {
          alert("เวลาไม่ถูกต้องหรือซ้ำกัน");
        }
      } else if (action === "delete") {
        if (confirm(`ลบเวลา ${time} ?`)) {
          times.splice(index, 1);
          if (selectedTime === time) selectedTime = times[0] || "";
          renderTimeSelector();
          renderForm();
        }
      }
    };

    menu.appendChild(input);
    menu.appendChild(menuBtn);
    menu.appendChild(dropdown);
    wrapper.appendChild(menu);
    selector.appendChild(wrapper);
  });
}

function addTime() {
  const newTime = prompt("กรุณากรอกเวลา (เช่น 11:00):");
  if (newTime && !times.includes(newTime)) {
    times.push(newTime);
    selectedTime = newTime;
    renderTimeSelector();
    renderForm();
  }
}

function renderForm() {
  const container = document.getElementById("od-form-container");
  container.innerHTML = "";
  times.forEach(time => {
    const section = document.createElement("section");
    section.style.display = time === selectedTime ? "block" : "none";
    section.id = `od-section-${time}`;
    section.innerHTML = `
      <h2>เส้นผ่านศูนย์กลางภายนอก (OD) [เวลา ${time}]</h2>
      <div class="grid grid-4">
        <div class="pipe-section">
          <div class="pipe-option">
            <label class="checkbox-item">
              <input type="checkbox" name="odType_${time}" value="circle" />
              <span>ท่อกลม</span>
              <input type="text" name="odCircleType_${time}" class="circle-input" placeholder="ระบุเพิ่มเติม" />
            </label>
            <div class="tolerance-group">
              <label>+ / -</label>
              <input type="text" name="odTolerance_${time}" class="tolerance-input" />
              <span>mm.</span>
            </div>
            <div class="range-group">
              <span>(</span>
              <input type="text" name="odMin_${time}" class="range-input" />
              <span>-</span>
              <input type="text" name="odMax_${time}" class="range-input" />
              <span>mm.)</span>
            </div>
          </div>
          <div class="line-break"></div>
          <div class="pipe-option">
            <label class="checkbox-item">
              <input type="checkbox" name="odType_${time}" value="square" />
              <span>ท่อสี่เหลี่ยมจัตุรัส,ผืนผ้า</span>
            </label>
            <div class="tolerance-group">
              <input type="text" name="odSquareA_${time}" class="range-input" />
              <label>+ / -</label>
              <input type="text" name="odSquareA_tolerance_${time}" class="range-input" />
            </div>
            <div class="range-group">
              <span>(</span>
              <input type="text" name="odSquareA_min_${time}" class="range-input" />
              <span>-</span>
              <input type="text" name="odSquareA_max_${time}" class="range-input" />
              <span>mm.)</span>
            </div>
          </div>
          <div class="line-break"></div>
          <div>
            <div class="tolerance-group">
              <input type="text" name="odSquareB_${time}" class="range-input" />
              <label>+ / -</label>
              <input type="text" name="odSquareB_tolerance_${time}" class="range-input" />
            </div>
            <div class="range-group">
              <span>(</span>
              <input type="text" name="odSquareB_min_${time}" class="range-input" />
              <span>-</span>
              <input type="text" name="odSquareB_max_${time}" class="range-input" />
              <span>mm.)</span>
            </div>
          </div>
        </div>
        ${['หัว', 'กลาง', 'ท้าย'].map(pos => `
          <div>
            <h3>ตำแหน่ง: ${pos}</h3>
            <div class="od-sides">
              ${['A','B','C','D'].map(side => `<label>ด้าน ${side}: <input type="text" name="od${pos}${side}_${time}"></label>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(section);
  });
}

renderTimeSelector();
renderForm();
