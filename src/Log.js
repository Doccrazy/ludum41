import React from 'react';
import { connect } from 'react-redux';

const Log = ({entries}) => <div>
  {(entries || []).map((l, idx) =>
    <div key={idx}>{l}</div>).reverse()}
</div>;

export default connect(state => ({
  entries: state.log
}))(Log);