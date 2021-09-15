import React from 'react';

const Table = () => {
  return (
    <>
    <section>
     <div className="container" style={{ marginTop: '20px' }}>
        <div className="row">
          <div className="col-lg-12 mx-auto">
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th>
                    image
                  </th>
                  <th>
                    name
                  </th>
                  <th>
                    description
                  </th>
                  <th>
                    action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    ok
                  </td>
                  <td>
                    ok
                  </td>
                  <td>
                    ok
                  </td>
                  <td>
                    ok
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};
export default Table;
