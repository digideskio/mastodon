import PureRenderMixin    from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';

const Header = React.createClass({

  propTypes: {
    account: ImmutablePropTypes.map.isRequired,
    me: React.PropTypes.number.isRequired
  },

  mixins: [PureRenderMixin],

  render () {
    const { account, me } = this.props;

    let displayName = account.get('display_name');
    let info = '';

    if (displayName.length === 0) {
      displayName = account.get('username');
    }

    if (me !== account.get('id') && account.getIn(['relationship', 'followed_by'])) {
      info = <span style={{ position: 'absolute', top: '10px', right: '10px', opacity: '0.7', display: 'inline-block', verticalAlign: 'top', background: 'rgba(0, 0, 0, 0.4)', color: '#fff', textTransform: 'uppercase', fontSize: '11px', fontWeight: '500', padding: '4px', borderRadius: '4px' }}>Follows you</span>
    }

    return (
      <div style={{ flex: '0 0 auto', background: '#2f3441', textAlign: 'center', backgroundImage: `url(${account.get('header')})`, backgroundSize: 'cover', position: 'relative' }}>
        <div style={{ background: 'rgba(47, 52, 65, 0.8)', padding: '30px 10px' }}>
          <a href={account.get('url')} target='_blank' rel='noopener' style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
            <div style={{ width: '90px', margin: '0 auto', marginBottom: '15px' }}>
              <img src={account.get('avatar')} alt='' style={{ display: 'block', width: '90px', height: '90px', borderRadius: '90px' }} />
            </div>

            <span style={{ display: 'inline-block', color: '#fff', fontSize: '20px', lineHeight: '27px', fontWeight: '500' }}>{displayName}</span>
          </a>

          <span style={{ fontSize: '14px', fontWeight: '400', display: 'block', color: '#2b90d9', marginBottom: '15px' }}>@{account.get('acct')}</span>
          <p style={{ color: '#616b86', fontSize: '14px' }}>{account.get('note')}</p>

          {info}
        </div>
      </div>
    );
  }

});

export default Header;
