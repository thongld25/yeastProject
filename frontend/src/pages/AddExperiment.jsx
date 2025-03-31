import React from "react";

const AddExperiment = () => {

  return (
    // tạo 1 trang có thể thêm thí nghiệm mới tải ảnh lên và nhập thông tin thí nghiệm
    <div class="content flex-grow-1">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header">
                <h4>Add Experiment</h4>
              </div>
              <div class="card-body">
                <form action="#">
                  <div class="mb-3">
                    <label for="experiment-name" class="form-label">
                      Experiment Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="experiment-name"
                      placeholder="Enter experiment name"
                      required
                    ></input>
                  </div>
                  <div class="mb-3">
                    <label for="experiment-description" class="form-label">
                      Experiment Description
                    </label>
                    <textarea
                      class="form-control"
                      id="experiment-description"
                      rows="3"
                      placeholder="Enter experiment description"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExperiment;
