import React from 'react';
import { connect } from 'react-redux';
import './Log.css';

const Log = ({entries}) => <div className="log">
  {(entries || []).map((l, idx) =>
    <div key={idx} className={`log-${l.style}`}>{l.message}</div>).reverse()}
</div>;

export default connect(state => ({
  entries: state.log
}))(Log);