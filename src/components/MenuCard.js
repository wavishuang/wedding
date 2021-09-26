import React from 'react';
import Card from 'react-bootstrap/Card';

const MenuCard = (props) => {
  const {menuGid, menuId} = props;
  const {
    name, 
    subItems,
    gid: selfGid
  } = props.menu;

  return (
    <Card>
      <Card.Header>
        <h2 className="mb-0">
          <button type="button" className="btn btn-link" onClick={() => props.setMenuGid(selfGid)}>{name}</button>
        </h2>
      </Card.Header>

      <div className={selfGid === menuGid ? "collapse show" : "collapse"}>
        <Card.Body>
          <div className="list-group">
            {subItems.map(item => {
              if(item.id % 10 === 0) return ;
              let itemContent = item.text;
              const {id: itemId} = item;

              if(Array.isArray(itemContent)) {
                itemContent = item.text[0] +'<br />'+ item.text[1];
                if(item.link === '#') {
                  return (<a className={itemId === menuId ? "list-group-item active" : "list-group-item"} key={item.id} onClick={() => props.setMenuId(item.id)}>{item.text[0]}<br />{item.text[1]}</a>)
                } else {
                  return (<a href={item.link} className={itemId === menuId ? "list-group-item active" : "list-group-item"} key={item.id} onClick={() => props.setMenuId(item.id)}>{item.text[0]}<br />{item.text[1]}</a>)
                }
                
              } else {
                if(item.link === '#') {
                  return (<a className={itemId === menuId ? "list-group-item active" : "list-group-item"} key={item.id} onClick={() => props.setMenuId(item.id)}>{itemContent}</a>)
                } else {
                  return (<a href={item.link} className={itemId === menuId ? "list-group-item active" : "list-group-item"} key={item.id} onClick={() => props.setMenuId(item.id)}>{itemContent}</a>)
                }
              }
            })}
          </div>
        </Card.Body>              
      </div>
    </Card>
  );
}

export default MenuCard;
