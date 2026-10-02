-- Private files: uploads and short-lived viewing links are authorized by the app.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('wiveli-coupon-attachments','wiveli-coupon-attachments',false,52428800,
array['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime','application/pdf','audio/mpeg','audio/mp4','audio/wav','audio/ogg','audio/webm'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
-- No anonymous/authenticated write/read policy: the server issues scoped signed URLs.
