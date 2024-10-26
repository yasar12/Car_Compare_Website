--insert into car (id,marka,model) values (1,'ford','focus')
--insert into car (id,marka,model) values (3,'BMW','i5')
--select id,marka,model from car
--select model from car
--select * from car
select * from car where marka='ford' and id=1 or model='focus'
